# Component Implementation Patterns

Deep-dive reference for building production interfaces with shadcn/ui, Radix UI, and modern React.

---

## 1. shadcn/ui Setup

```bash
npx shadcn@latest init
npx shadcn@latest add button input form card dialog select sheet toast
```

Key concepts:

- **Not an npm package** -- components are copied into your project. You own the code and can modify it freely.
- Built on **Radix UI** primitives, which provide accessibility out of the box (focus management, ARIA attributes, keyboard navigation).
- Styled with **Tailwind CSS** utilities -- no CSS-in-JS runtime.
- Required dependencies:
  - `class-variance-authority` (CVA) -- variant management
  - `clsx` -- conditional class joining
  - `tailwind-merge` -- deduplicates conflicting Tailwind classes
  - `lucide-react` -- icon library
  - `tailwindcss-animate` -- animation utilities

The `cn()` utility combines `clsx` and `tailwind-merge`:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 2. CSS Variables for Theming (HSL Format)

shadcn uses HSL values without the `hsl()` wrapper so Tailwind can apply opacity modifiers:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... remaining dark overrides */
  }
}
```

Usage in `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      // ...
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
  },
}
```

---

## 3. Button Patterns

Use CVA to define variants declaratively:

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

Design rules:

- **Press feedback**: `active:scale-[0.97]` gives tactile response without layout shift.
- **Focus ring**: Always visible via `focus-visible:ring-2`. Never use `outline: none` without a replacement.
- **Loading state**: Disable the button and show a spinner inline.

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
)
```

---

## 4. Form Patterns (React Hook Form + Zod)

Schema-first validation keeps validation logic co-located and type-safe:

```tsx
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2).max(50),
})

type FormValues = z.infer<typeof formSchema>
```

The shadcn Form components wire React Hook Form to accessible markup:

```tsx
function SignUpForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", name: "" },
    mode: "onBlur", // validate on blur, not keystroke
  })

  function onSubmit(values: FormValues) {
    // handle submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ...more fields */}
        <Button type="submit" isLoading={form.formState.isSubmitting}>
          Sign Up
        </Button>
      </form>
    </Form>
  )
}
```

Accessibility rules:

- `FormMessage` renders error text with `aria-describedby` linked to the input.
- Inputs get `aria-invalid="true"` when in error state automatically.
- Mark required fields with `aria-required="true"`.
- Validate on **blur**, not on every keystroke -- reduces noise and respects user flow.
- Use **progressive disclosure** for complex forms: show additional fields only when relevant.

---

## 5. Card Patterns

```tsx
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card"

<Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
  <CardHeader>
    <CardTitle>Project Settings</CardTitle>
    <CardDescription>Manage your project configuration.</CardDescription>
  </CardHeader>
  <CardContent>
    {/* form fields or content */}
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

Design rules:

- **Concentric border radius**: Outer radius = inner radius + padding. If inner elements have `rounded-md` (6px) and padding is 16px, outer card should be `rounded-xl` (12px) or greater.
- **Layered shadows**: Use multiple shadow values for natural depth -- `shadow-sm` at rest, `shadow-lg` on hover.
- **Hover lift**: Subtle `translateY(-2px)` on hover, never more than 4px.
- Use semantic color tokens (`bg-card`, `text-card-foreground`) so cards adapt to theme changes.

---

## 6. Dialog (Modal) Patterns

```tsx
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* form content */}
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Accessibility and interaction rules (handled by Radix):

- **Focus trap**: Focus stays inside the modal while open. Tab wraps from last to first focusable element.
- **ESC to close**: Always. No exceptions.
- **Click outside overlay**: Closes the dialog by default.
- `aria-modal="true"` is set automatically.
- `aria-labelledby` points to `DialogTitle`, `aria-describedby` points to `DialogDescription`.
- **Restore focus**: When dialog closes, focus returns to the trigger element.
- **Animation origin**: `transform-origin: center` -- dialogs are an exception to the popover origin-from-trigger rule since they appear center-screen.

---

## 7. Select/Dropdown Patterns

```tsx
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem, SelectGroup, SelectLabel,
} from "@/components/ui/select"

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="blueberry">Blueberry</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

Interaction rules:

- **Keyboard navigation**: Arrow keys to move between items, Enter/Space to select, ESC to close, type-ahead to jump to matching items.
- ARIA: `aria-haspopup="listbox"` on trigger, `aria-expanded` toggles with open state.
- **Transform origin**: Popover should animate from the trigger position (origin-aware), not from center.
- **Tooltip delay skip**: If a user hovers over one select and then moves to another, skip the tooltip delay on the second hover.

---

## 8. Sheet (Slide-over) Patterns

```tsx
import {
  Sheet, SheetTrigger, SheetContent,
  SheetHeader, SheetTitle, SheetDescription,
  SheetFooter, SheetClose,
} from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </SheetTrigger>
  <SheetContent side="right"> {/* "left" | "right" | "top" | "bottom" */}
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
      <SheetDescription>Browse sections of the app.</SheetDescription>
    </SheetHeader>
    <nav className="flex flex-col gap-2 py-4">
      {/* nav links */}
    </nav>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outline">Close</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

Use cases:

- **Mobile navigation**: Slide from left with full-height overlay.
- **Detail panels**: Slide from right to show item details without leaving the list view.
- **Filters**: Slide from bottom on mobile for filter controls.

Sheets share the same accessibility behavior as Dialog: focus trap, ESC to close, overlay click to close, and focus restoration.

---

## 9. Toast/Notification Patterns

Using the shadcn Toast (or Sonner for a lighter API):

```tsx
// With shadcn toast
import { useToast } from "@/components/ui/use-toast"

function SaveButton() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Changes saved",
          description: "Your settings have been updated.",
        })
      }}
    >
      Save
    </Button>
  )
}

// With Sonner (simpler API)
import { toast } from "sonner"

toast.success("Changes saved")
toast.error("Something went wrong")
toast.promise(saveSettings(), {
  loading: "Saving...",
  success: "Settings saved",
  error: "Could not save",
})
```

Design and accessibility rules:

- **Auto-dismiss**: 3-5 seconds for informational toasts. Errors should persist or have longer duration.
- `aria-live="polite"` -- screen readers announce without stealing focus.
- **CSS transitions, not keyframes** -- toasts can be triggered rapidly; transitions handle interruption gracefully while keyframes restart from the beginning.
- **Pause timers** when the browser tab is hidden (`document.visibilityState`).
- **Swipe to dismiss**: Support horizontal swipe with momentum detection (velocity > threshold = dismiss, otherwise snap back).

---

## 10. Table Patterns

```tsx
import {
  Table, TableHeader, TableBody, TableFooter,
  TableHead, TableRow, TableCell, TableCaption,
} from "@/components/ui/table"

<div className="overflow-x-auto rounded-md border">
  <Table>
    <TableCaption>A list of recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {invoices.map((invoice) => (
        <TableRow key={invoice.id}>
          <TableCell className="font-medium">{invoice.id}</TableCell>
          <TableCell>{invoice.status}</TableCell>
          <TableCell className="text-right">{invoice.amount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

Rules:

- **Responsive**: Wrap table in `overflow-x-auto` container. Below tablet breakpoint, allow horizontal scroll rather than collapsing columns.
- **Sortable columns**: Use `aria-sort="ascending"` or `aria-sort="descending"` on the active `TableHead`. Show a visual indicator (chevron icon).
- **Virtualization**: For lists exceeding ~50 items, use `@tanstack/react-virtual` or similar to render only visible rows.
- **Row distinction**: Use zebra striping (`even:bg-muted/50`) or subtle borders between rows. Never rely on color alone.

---

## 11. Chart Integration

When integrating charts (Recharts, Chart.js, or similar):

- **Match chart type to data intent**:
  - Trend over time: line chart
  - Comparison across categories: bar chart
  - Part-of-whole: pie/donut chart
  - Distribution: histogram
  - Correlation: scatter plot

- **Accessible color palettes**: Use colors distinguishable by colorblind users. Supplement with patterns, textures, or different shapes for data points.
- **Always include a legend** and provide **tooltips on hover/focus** for precise values.
- **Screen reader alternative**: Provide a visually hidden `<table>` with the same data so screen readers can access it.
- **Respect `prefers-reduced-motion`**: Skip entrance animations or reduce them to simple fades when the user has requested reduced motion.

```tsx
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches

<LineChart data={data}>
  <Line
    type="monotone"
    dataKey="value"
    animationDuration={prefersReducedMotion ? 0 : 500}
  />
</LineChart>
```

---

## 12. Server Component Wrapping (Next.js)

Most shadcn/ui components use React state or event handlers and require `"use client"`. Structure your components to keep data fetching in server components:

```tsx
// app/dashboard/page.tsx (Server Component -- no "use client")
import { getProjects } from "@/lib/data"
import { ProjectList } from "./project-list"

export default async function DashboardPage() {
  const projects = await getProjects()
  return <ProjectList projects={projects} />
}
```

```tsx
// app/dashboard/project-list.tsx (Client Component)
"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProjectListProps {
  projects: { id: string; name: string; status: string }[]
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.status}</p>
            <Button variant="outline" size="sm">View</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

The pattern: **Server component fetches data, passes to client component as serializable props.** This keeps the client bundle small and data fetching on the server.

---

## 13. CVA (class-variance-authority) Deep Dive

CVA lets you define component variants declaratively, replacing sprawling conditional class logic:

```ts
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
```

Key patterns:

- **Compose with `cn()`**: Always wrap CVA output with `cn()` so consumer-passed `className` can override defaults via `tailwind-merge`.
- **Type extraction**: `VariantProps<typeof badgeVariants>` generates the TypeScript type for variant props automatically.
- **Compound variants**: Handle combinations of variant values that need special styling:

```ts
const inputVariants = cva("...", {
  variants: {
    size: { sm: "...", lg: "..." },
    state: { error: "...", success: "..." },
  },
  compoundVariants: [
    { size: "sm", state: "error", class: "border-2 border-red-500" },
  ],
})
```

- **Use CVA for any component with visual variants** -- buttons, badges, alerts, inputs, cards. It replaces manual `if/else` class concatenation with a declarative, type-safe API.
