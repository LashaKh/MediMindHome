import React from 'react';
import { SectionShell, EyebrowBadge, Column, Reveal } from '../ui';
import { problemContent as c, type ProblemFigure } from '../../content/landing.top';
import { cn } from '../../utils/cn';

/**
 * The problem: the sector's numbers first, then three problems in the owner's
 * terms. Mirrors the v6 deck slide: 2.4% is the one dominant number (navy),
 * the loss figure is the only red on the page, the state share sits beside it.
 * Then the three problems as deck columns with the 4px top rule.
 */
const FigureLabel: React.FC<{ figure: ProblemFigure; className?: string }> = ({ figure, className }) => (
  <p className={cn('mm-body', className)}>
    {figure.before}
    <strong className="font-semibold text-mm-ink">{figure.strong}</strong>
    {figure.after}
  </p>
);

export const ProblemSection: React.FC = () => (
  <SectionShell id="problem" tone="white" labelledBy="problem-title">
    <EyebrowBadge label={c.eyebrow} />
    <h2 id="problem-title" className="mm-h2 mt-4 max-w-3xl [text-wrap:balance]">
      {c.title} <br className="hidden md:inline" />
      <span className="mm-accent-text">{c.accent}</span>
      {c.end}
    </h2>

    <div className="mt-12 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-12 lg:mt-16">
      <div className="md:col-span-6 lg:col-span-6">
        <p className="mm-stat text-[4.5rem] md:text-[6rem] lg:text-[8rem]">{c.lead.value}</p>
        <FigureLabel figure={c.lead} className="mt-5 max-w-sm" />
      </div>

      <div className="grid gap-8 border-t border-mm-line pt-8 md:col-span-6 md:border-l md:border-t-0 md:pl-12 md:pt-0 lg:col-span-6">
        <div>
          <p className="mm-h2 tabular-nums text-mm-alert">{c.loss.value}</p>
          <FigureLabel figure={c.loss} className="mt-2 max-w-sm" />
        </div>
        <div>
          <p className="mm-h2 tabular-nums">{c.state.value}</p>
          <FigureLabel figure={c.state} className="mt-2 max-w-sm" />
        </div>
      </div>
    </div>

    <p className="mm-caption mt-10 max-w-2xl md:mt-12">{c.source}</p>

    <p className="mm-lead mt-16 max-w-2xl [text-wrap:pretty] md:mt-20">{c.support}</p>

    <div className="mt-10 grid max-w-xl gap-10 lg:max-w-none lg:grid-cols-3 lg:gap-10">
      {c.problems.map((problem, index) => (
        <Reveal key={problem.title} delay={index * 75}>
          <Column title={problem.title} className="[&_h3]:[text-wrap:balance]">
            <p>{problem.body}</p>
          </Column>
        </Reveal>
      ))}
    </div>

    <p className="mm-body mt-12 font-semibold text-mm-ink md:mt-14">{c.closing}</p>
  </SectionShell>
);
