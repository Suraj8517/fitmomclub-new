export function OptimizeCloudinaryUrl(url, transformation = "q_auto,f_mp4,w_500") {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transformation}/`);
}