import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const tools = [
    {
      name: "Content Summarizer",
      description: "Condense articles and media content",
      icon: "/icons/summarize.svg",
      href: "/tools/summarizer",
    },
    {
      name: "Code Generator",
      description: "AI-powered development assistance",
      icon: "/icons/code.svg",
      href: "/tools/code-generator",
    },
    {
      name: "AI Writing Tool",
      description: "Create engaging content with AI",
      icon: "/icons/write.svg",
      href: "/tools/writing-tool",
    },
    {
      name: "Email / Message Draft Generator",
      description: "Create personalized emails and messages",
      icon: "/icons/email.svg",
      href: "/tools/message-generator",
    },
    {
      name: "TO-DO List",
      description: "Organize and track your daily tasks",
      icon: "/icons/planner.svg",
      href: "/tools/todo-list",
    },
  ];

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">AI Tools Platform</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Access powerful AI capabilities in one unified platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link
              href={tool.href}
              key={tool.name}
              className="block p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <Image
                    src={tool.icon}
                    alt={`${tool.name} icon`}
                    width={32}
                    height={32}
                    className="text-blue-500"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="mt-20 text-center text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} AI Tools Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
