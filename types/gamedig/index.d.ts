declare module 'gamedig' {
  export function query({
    type,
    host,
    port,
  }: {
    type: 'arkse';
    host: string;
    port: number;
  }): Ark.Server;
}
