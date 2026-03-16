// Allow importing PEM keys as string

declare module '*.pem' {
  const content: string;
  export default content;
}
