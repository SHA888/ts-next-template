import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to <span className="text-primary">Next.js Template</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-[700px] text-lg">
          A modern Next.js template with TypeScript, Tailwind CSS, and more. Get started by
          exploring the components below.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Button Component</CardTitle>
            <CardDescription>Fully customizable button with variants and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dark Mode</CardTitle>
            <CardDescription>Toggle between light and dark theme</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The theme toggle in the navigation bar allows you to switch between light and dark
              modes. The system will also respect your OS preference.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="font-medium">Current Theme:</p>
              <p className="text-muted-foreground text-sm">
                The current theme is automatically detected from your system settings.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Learn more about theming
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Responsive Design</CardTitle>
            <CardDescription>Built with mobile-first approach</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This template is fully responsive and works on all device sizes. Resize your browser
              to see it in action!
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-primary/10 text-primary rounded p-2">Mobile</div>
              <div className="bg-secondary/10 text-secondary rounded p-2">Tablet</div>
              <div className="bg-success/10 text-success rounded p-2">Desktop</div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Start building your application with these components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-semibold">Components</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Button</li>
                  <li>• Card</li>
                  <li>• Theme Toggle</li>
                  <li>• Navigation</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Features</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Dark Mode</li>
                  <li>• Responsive Design</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Tools</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• ESLint</li>
                  <li>• Prettier</li>
                  <li>• Husky</li>
                  <li>• lint-staged</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Documentation</Button>
            <Button>Get Started</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
