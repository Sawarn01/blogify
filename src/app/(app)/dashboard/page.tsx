'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PlusCircle, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import type { Post } from '@/lib/types';

export default function DashboardPage() {
  const { user, appUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
        if (!user || !db) {
            setIsLoading(false);
            return
        };

        setIsLoading(true);
        try {
            const postsCollectionRef = collection(db, 'posts');
            const q = query(postsCollectionRef, where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
            
            // Sort posts on the client-side by creation date, newest first.
            const sortedPosts = userPosts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

            setPosts(sortedPosts);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFirebaseConfigured) {
      fetchPosts();
    } else {
        setIsLoading(false);
    }
  }, [user]);

  if (!isFirebaseConfigured) {
      return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2 text-destructive">
                    <AlertTriangle />
                    Firebase Not Configured
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    Your application is running in a limited mode. Please configure your Firebase credentials in a <strong>.env</strong> file to see your dashboard and enable content generation.
                </p>
            </CardContent>
        </Card>
      )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Welcome Back, {appUser?.displayName || 'Creator'}!</CardTitle>
          <CardDescription>Ready to create some amazing content? Get started below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/generate/ideas">
              <PlusCircle className="mr-2 h-5 w-5" />
              Start New Blog Post
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">My Generated Posts</CardTitle>
          <CardDescription>Here are the blog posts you&apos;ve recently generated.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : posts.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">Generated On</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {post.title}
                        </TableCell>
                        <TableCell className="text-right">
                            <Badge variant="outline">{post.createdAt?.toDate().toLocaleDateString()}</Badge>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <p>You haven&apos;t generated any posts yet.</p>
                    <p className='mt-2'>Click &quot;Start New Blog Post&quot; to begin.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
