import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';

export const revalidate = 0;

export default async function Post({ params }: { params: { id: string } }) {
  const { data: post } = await supabase
    .from('posts').select('*').eq('id', params.id).single();

  if (!post) return <div>Not Found</div>;

  return (
    <div className="max-w-3xl mx-auto p-10">
      <Link href="/" className="text-gray-500 mb-4 block">← Back</Link>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="prose lg:prose-xl">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}