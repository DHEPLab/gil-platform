import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";

/* ─── shadcn ui ─── */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Head from "next/head";

const faqs = [
  {
    q: "What is the main goal of this project?",
    a: "To refine large-language models for primary-care diagnostics by incorporating collective expert feedback—improving accuracy, safety, and relevance for underserved communities.",
  },
  {
    q: "Who is leading the study?",
    a: "The Principal Investigator is Dr. Sean Sylvia, in collaboration with faculty from Health Policy & Management, Computer Science, Biostatistics, and other UNC departments.",
  },
  {
    q: "Who can participate as an expert reviewer?",
    a: "Licensed physicians, nurse practitioners, physician assistants, and senior medical residents with primary-care experience in the US or Kenya.",
  },
  {
    q: "What will I actually do on the platform?",
    a: "Review two short patient vignettes at a time, flip each card for clinical details, then decide if the case is REAL or SYNTHETIC. Your choice is recorded instantly.",
  },
  {
    q: "How long does it take to finish an assignment?",
    a: "A set of two cases typically takes 3-5 minutes. You can complete additional sets any time you like.",
  },
  {
    q: "Do I get feedback on my accuracy?",
    a: "Yes. After each batch you’ll see your accuracy and how it compares to the collective expert score.",
  },
  {
    q: "Is my input anonymous?",
    a: "Your personal identity is never shown publicly. We track responses by user ID only to compute accuracy and engagement statistics.",
  },
  {
    q: "How is my feedback used to improve the AI?",
    a: "Your responses power a Reinforcement Learning with Expert Feedback (RLEF) loop that fine-tunes the model, reducing hallucinations and adapting content for local contexts.",
  },
  {
    q: "Will I be compensated?",
    a: "During the pilot phase we offer digital gift cards for every completed batch. Details will appear in your dashboard.",
  },
  {
    q: "Can I use a mobile device?",
    a: "Absolutely. The interface is responsive and swipe gestures work on touch screens.",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const FAQ: NextPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>FAQs | CollectiveGood</title>
      </Head>

      <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-16">
        {/* header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-4xl font-extrabold text-[#234851]"
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-3 text-center text-lg text-[#4c6d74]"
        >
          Everything you might want to know before you dive in
        </motion.p>

        {/* accordion */}
        <Accordion type="single" collapsible className="mt-12 space-y-4">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={itemVariants}
            >
              <Card className="border border-[#B6EBE9] shadow-sm transition hover:shadow-md">
                <CardHeader className="px-6 py-4">
                  <AccordionItem value={f.q}>
                    <AccordionTrigger className="text-lg font-medium text-[#234851]">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="px-0 pb-6 pt-2 text-gray-700 leading-relaxed">
                        {f.a}
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </Accordion>

        {/* contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 rounded-lg bg-[#EDF6F3] p-6 text-center shadow-sm"
        >
          <p className="text-sm text-[#4c6d74]">
            Still have questions? Email&nbsp;
            <a
              href="mailto:sophia@collectivegood.io"
              className="font-semibold text-[#7097A8] underline underline-offset-2"
            >
              sophia@collectivegood.io
            </a>
          </p>
        </motion.div>

        {/* back button */}
        <div className="mt-12 flex justify-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-[#7097A8] hover:bg-[#5f868d] text-white flex items-center gap-2 px-6 py-2"
          >
            <ArrowLeft size={18} /> Back to Study
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
