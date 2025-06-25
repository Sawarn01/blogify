import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PlusCircle, FileText } from 'lucide-react';

const mockPosts = [
  {
    title: '10 Tips for Sustainable Living in Urban Environments',
    date: '2024-05-20',
  },
  {
    title: 'The Future of Digital Marketing: Trends to Watch in 2025',
    date: '2024-05-18',
  },
  {
    title: 'A Beginner\'s Guide to Investing in Cryptocurrency',
    date: '2024-05-15',
  },
];

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Welcome Back!</CardTitle>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Generated On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPosts.map((post) => (
                <TableRow key={post.title}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {post.title}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{new Date(post.date).toLocaleDateString()}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
