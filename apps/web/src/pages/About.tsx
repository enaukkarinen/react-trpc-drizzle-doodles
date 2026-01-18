import { Link } from "react-router-dom";

export function About() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">About</h1>
        <p className="text-sm text-slate-600">
         This application demonstrates a feedback management system built with a React, tRPC, and Postgres stack.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-900">
              Hi, I’m Einari.
            </div>
            <p className="text-sm leading-6 text-slate-700">
              I’m a Principal Software Engineer at{" "}
              <span className="font-medium text-slate-900">
                EG (Estates Gazette)
              </span>
              , working on data-heavy, customer-facing products in the commercial property
              space. My role spans front-end architecture, API design, and
              collaboration with product and UX.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-900">Background</div>
            <p className="text-sm leading-6 text-slate-700">
              My primary front-end background is in Angular, where I’ve spent
              several years building and evolving large-scale applications. For
              this exercise, the technology stack was provided as part of the
              brief, and I focused on applying familiar engineering and UX
              principles within that context.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-900">Approach</div>
            <p className="text-sm leading-6 text-slate-700">
              The goal here was to build something realistic and representative
              of how I approach day-to-day product engineering: clear data
              boundaries, predictable state, and UI that feels calm and
              intentional.
            </p>
            <p className="text-sm leading-6 text-slate-700">
              I’ve worked with similar database and query-layer patterns before,
              including using tools like Kysely, so this was also an opportunity
              to work with Drizzle and tRPC together and evaluate how well they
              support type-safe workflows.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-900">
              Key learnings
            </div>
            <p className="text-sm leading-6 text-slate-700">
              One of the most valuable aspects of building this app was the
              experience of sharing and enforcing type definitions across the
              database, Node services, and React application. Keeping enums and
              schemas aligned across layers helped reduce drift and made it
              easier to evolve the application with confidence.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-900">Stack</div>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>
                <span className="font-medium text-slate-900">Frontend:</span>{" "}
                React + Vite + React Router + Tailwind CSS
              </li>
              <li>
                <span className="font-medium text-slate-900">Data:</span> tRPC +
                TanStack Query
              </li>
              <li>
                <span className="font-medium text-slate-900">Backend:</span>{" "}
                Express + tRPC
              </li>
              <li>
                <span className="font-medium text-slate-900">Database:</span>{" "}
                Postgres (Docker) + Drizzle ORM
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-slate-200 bg-white p-4">
            <div>
              <div className="text-sm font-medium text-slate-900">
                Explore the demo
              </div>
              <div className="text-xs text-slate-500">
                View the feedback list and try creating or editing an item.
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-100"
            >
              Go to Feedback
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
