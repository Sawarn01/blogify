import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { CheckCircle, Feather, BrainCircuit, BarChart, Rocket } from 'lucide-react';
import { Logo } from '@/components/logo';

const features = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-accent" />,
    title: 'AI Idea Generation',
    description: 'Never run out of ideas. Generate unique, engaging blog post topics based on your industry and target audience.',
  },
  {
    icon: <Feather className="w-8 h-8 text-accent" />,
    title: 'Full Content Creation',
    description: 'Go from idea to full draft in minutes. Our AI writes comprehensive, well-structured articles for you.',
  },
  {
    icon: <BarChart className="w-8 h-8 text-accent" />,
    title: 'SEO Keyword Suggestions',
    description: 'Boost your rankings with relevant, long-tail keywords that have low competition and high search potential.',
  },
  {
    icon: <Rocket className="w-8 h-8 text-accent" />,
    title: 'Save Time & Rank Higher',
    description: 'Automate your content pipeline, improve your SEO strategy, and focus on growing your business.',
  },
];

const faqs = [
  {
    question: 'Who is Blogify AI for?',
    answer: 'Blogify AI is for content creators, marketers, bloggers, and businesses of all sizes who want to streamline their content creation process and improve their search engine rankings.',
  },
  {
    question: 'How does the free plan work?',
    answer: 'Our free plan allows you to generate up to 3 blog posts per month to experience the power of our platform. To generate more content, you can upgrade to one of our premium plans.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your monthly or annual subscription at any time through your account settings. You will retain premium access until the end of your current billing period.',
  },
  {
    question: 'What makes Blogify AI different from other AI writers?',
    answer: 'We focus on a holistic approach to content creation, combining idea generation, full content writing, and crucial SEO keyword analysis into one seamless workflow. Our integration with the latest Google Gemini models ensures high-quality, relevant, and optimized content.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-lg font-headline">Blogify AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/sign-up">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="container text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-headline">
              Generate SEO-Optimized Blog Posts in Minutes with AI
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              Save time, conquer writer's block, and climb the ranks on Google. Blogify AI is your all-in-one solution for creating high-quality content that drives traffic.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/sign-up">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-24 bg-secondary">
          <div className="container">
            <h2 className="text-3xl sm:text-4xl font-bold text-center font-headline">Everything You Need to Scale Your Content</h2>
            <p className="mt-4 text-center max-w-2xl mx-auto text-muted-foreground">
              From ideation to publication, Blogify AI provides the tools to supercharge your content strategy.
            </p>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-background mx-auto shadow-md">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-bold font-headline">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 sm:py-24">
          <div className="container">
            <h2 className="text-3xl sm:text-4xl font-bold text-center font-headline">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-center max-w-2xl mx-auto text-muted-foreground">
              Choose the plan that's right for you. Get started for free.
            </p>
            <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Monthly Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-extrabold">$9<span className="text-xl font-normal text-muted-foreground">/month</span></p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Unlimited Generations</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Full Content & Keywords</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Access to All AI Tools</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Priority Support</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                    <Link href="/sign-up">Choose Monthly</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-primary border-2 shadow-xl relative">
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Annual Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-extrabold">$49<span className="text-xl font-normal text-muted-foreground">/year</span></p>
                   <p className="font-semibold text-green-600">Save over 50%!</p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Unlimited Generations</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Full Content & Keywords</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Access to All AI Tools</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Priority Support</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                    <Link href="/sign-up">Choose Annual</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 sm:py-24 bg-secondary">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center font-headline">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full mt-12">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between py-8">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold font-headline">Blogify AI</span>
          </div>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">&copy; {new Date().getFullYear()} Blogify AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
