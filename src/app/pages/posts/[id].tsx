// pages/posts/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany();
  const paths = posts.map((post: { id: { toString: () => any; }; }) => ({ params: { id: post.id.toString() } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await prisma.post.findUnique({ where: { id: Number(params?.id) } });
  return { props: { post }, revalidate: 60 }; // ISR for revalidation
};
