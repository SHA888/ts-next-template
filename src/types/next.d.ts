import 'next';

declare module 'next' {
  export interface NextPageProps {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}
