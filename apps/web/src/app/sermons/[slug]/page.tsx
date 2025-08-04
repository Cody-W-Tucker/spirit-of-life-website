import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { CalendarDays, Clock, User } from "lucide-react";

// Placeholder data for the sermon
const sermonData = {
  title: "Walking in Faith: Trusting God's Plan",
  series: "Faith Journey",
  speaker: "Pastor Jonathan Lumbard",
  date: "March 17, 2024",
  duration: "45 minutes",
  description:
    "In this powerful message, Pastor Jonathan explores what it means to truly walk in faith and trust God's plan for our lives. Through biblical examples and personal stories, we discover how faith transforms our perspective and guides our decisions.",
  youtubeId: "LYnw5x_48Sg", // Placeholder YouTube ID
};

export default function SermonPage(): React.JSX.Element {
  const { title, series, speaker, date, duration, description, youtubeId } =
    sermonData;

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            {/* Badge and Title */}
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                {series}
              </Badge>
              <h1 className="heading-1">{title}</h1>
            </div>

            {/* Sermon Meta Information */}
            <div className="mb-8 flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{speaker}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Video and Content Section */}
      <div className="section-spacing">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
            {/* Main Content */}
            <main className="space-y-12">
              {/* Video Player */}
              <div className="space-y-6">
                <h2 className="heading-3">Watch the Message</h2>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Sermon Notes */}
              <div className="space-y-6">
                <h2 className="heading-3">Sermon Notes</h2>
                <div className="prose prose-lg max-w-none space-y-6">
                  <p>
                    Faith is not just a concept we read about in the Bible—it's
                    a living, breathing reality that transforms how we see the
                    world and make decisions. In today's message, we'll explore
                    what it means to truly walk in faith and trust God's plan
                    for our lives.
                  </p>

                  <h3 className="heading-4">What is Faith?</h3>
                  <p>
                    Hebrews 11:1 tells us that 'faith is confidence in what we
                    hope for and assurance about what we do not see.' This
                    definition challenges us to look beyond our immediate
                    circumstances and trust in God's greater plan.
                  </p>

                  <h3 className="heading-4">Biblical Examples of Faith</h3>
                  <p>
                    Throughout Scripture, we see countless examples of men and
                    women who walked in faith despite overwhelming odds. Abraham
                    left his homeland without knowing where he was going. Moses
                    led the Israelites through the Red Sea. David faced Goliath
                    with nothing but a sling and his trust in God.
                  </p>

                  <h3 className="heading-4">
                    Applying Faith to Our Daily Lives
                  </h3>
                  <p>
                    Faith isn't just for the big moments—it's for every decision
                    we make. When we choose to trust God in our relationships,
                    our careers, our finances, and our health, we're walking in
                    faith. This doesn't mean we don't plan or work hard, but it
                    does mean we trust God with the outcomes.
                  </p>

                  <h3 className="heading-4">
                    The Promise of God's Faithfulness
                  </h3>
                  <p>
                    When we walk in faith, we can be confident that God is
                    working all things together for our good (Romans 8:28). Even
                    when we don't understand the path ahead, we can trust that
                    God's plan is perfect and His timing is impeccable.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="rounded-xl bg-muted p-8">
                <h3 className="heading-4 mb-4">Continue Your Faith Journey</h3>
                <p className="text-muted-foreground mb-6">
                  Want to dive deeper into this message? Join us for our weekly
                  Bible study or connect with a small group to discuss these
                  themes further.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Join a Small Group</Button>
                  <Button variant="outline">Download Notes</Button>
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Message Outline */}
              <div className="sticky top-4 bg-white">
                <h3 className="heading-5 mb-4">Message Outline</h3>
                <nav className="space-y-2">
                  <a
                    href="#what-is-faith"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    What is Faith?
                  </a>
                  <a
                    href="#biblical-examples"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Biblical Examples of Faith
                  </a>
                  <a
                    href="#applying-faith"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Applying Faith to Our Daily Lives
                  </a>
                  <a
                    href="#god-faithfulness"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    The Promise of God's Faithfulness
                  </a>
                </nav>
              </div>

              {/* Related Sermons */}
              <div className="rounded-xl bg-muted p-6">
                <h3 className="heading-5 mb-4">Related Messages</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      The Power of Prayer
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Pastor Jonathan • March 10, 2024
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      Finding Peace in Chaos
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Pastor Jonathan • March 3, 2024
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      God's Grace in Difficult Times
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Pastor Jonathan • February 25, 2024
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
