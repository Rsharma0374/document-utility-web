// Service for async PDF to Image conversion
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export async function uploadPdfForImageConversion(file, format = 'PNG') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', format);

  const response = await fetch('http://localhost:10008/doc-service/pdf/to-images/async', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload PDF for image conversion');
  }

  // Assume response is JSON with a jobId
  const data = await response.json();
  console.log(data);
  const result = data.requestId;
  console.log(result);
  return result; // { jobId: '...' }
}

export function listenForImageResult(requestId, onResult, onError) {
  const socket = new SockJS('http://localhost:8081/ws');
  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      // Subscribe to the topic where backend will send the result
      stompClient.subscribe(`/topic/pdf-result/${requestId}`, (message) => {
        try {
          const payload = JSON.parse(message.body);
          onResult(payload);
        } catch (err) {
          onError && onError(err);
        }
      });
    },
    onStompError: (frame) => {
      console.error('STOMP error', frame);
      onError && onError(new Error(frame.body));
    }
  });

  stompClient.activate();
  return stompClient;
}