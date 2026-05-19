import type { SupabaseClient } from "@supabase/supabase-js";

export interface SignedStorageRequest {
  bucketName: string;
  storagePath: string;
  expiresInSeconds: number;
}

export interface SignedUploadResponse extends SignedStorageRequest {
  signedUrl: string;
  token?: string;
  path: string;
  mode: "supabase-signed-upload";
}

export interface SignedDownloadResponse extends SignedStorageRequest {
  signedUrl: string;
  path: string;
  mode: "supabase-signed-download";
}

export function buildSignedUploadRequest(input: {
  bucketName: string;
  storagePath: string;
  expiresInSeconds?: number;
}): SignedStorageRequest {
  return {
    bucketName: input.bucketName,
    storagePath: input.storagePath,
    expiresInSeconds: input.expiresInSeconds ?? 60 * 10,
  };
}

export function buildSignedDownloadRequest(input: {
  bucketName: string;
  storagePath: string;
  expiresInSeconds?: number;
}): SignedStorageRequest {
  return {
    bucketName: input.bucketName,
    storagePath: input.storagePath,
    expiresInSeconds: input.expiresInSeconds ?? 60 * 60,
  };
}

export async function createSupabaseSignedUploadUrl(
  supabase: SupabaseClient,
  input: SignedStorageRequest,
): Promise<SignedUploadResponse> {
  const { data, error } = await supabase.storage.from(input.bucketName).createSignedUploadUrl(input.storagePath);

  if (error) {
    throw new Error(`Could not create signed upload URL for ${input.bucketName}/${input.storagePath}: ${error.message}`);
  }

  return {
    ...input,
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
    mode: "supabase-signed-upload",
  };
}

export async function createSupabaseSignedDownloadUrl(
  supabase: SupabaseClient,
  input: SignedStorageRequest,
): Promise<SignedDownloadResponse> {
  const { data, error } = await supabase.storage
    .from(input.bucketName)
    .createSignedUrl(input.storagePath, input.expiresInSeconds);

  if (error) {
    throw new Error(`Could not create signed download URL for ${input.bucketName}/${input.storagePath}: ${error.message}`);
  }

  return {
    ...input,
    signedUrl: data.signedUrl,
    path: input.storagePath,
    mode: "supabase-signed-download",
  };
}
