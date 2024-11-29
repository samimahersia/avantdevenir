/**
 * Utility functions for client-side encryption/decryption of sensitive data
 */

const ENCRYPTION_KEY = 'AvantDeVenir'; // In production, this should be securely managed

export const encryptData = async (data: any): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  
  const keyBuffer = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyBuffer,
    dataBuffer
  );
  
  const encryptedArray = new Uint8Array(encryptedData);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);
  
  return btoa(String.fromCharCode(...combined));
};

export const decryptData = async (encryptedString: string): Promise<any> => {
  const decoder = new TextDecoder();
  const combined = new Uint8Array(
    atob(encryptedString)
      .split('')
      .map(char => char.charCodeAt(0))
  );
  
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);
  
  const keyBuffer = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(ENCRYPTION_KEY),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    keyBuffer,
    encryptedData
  );
  
  const decryptedString = decoder.decode(decryptedBuffer);
  return JSON.parse(decryptedString);
};