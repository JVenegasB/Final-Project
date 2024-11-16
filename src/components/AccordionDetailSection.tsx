import { AccordionHeader, AccordionItem, AccordionPanel } from "@fluentui/react-components";

interface AccordionDetailSectionProps {
    title: string;
    children: React.ReactNode;
  }
  
export default function AccordionDetailSection({ title, children }: AccordionDetailSectionProps) {
    return (
      <AccordionItem value={title}>
        <AccordionHeader>
          <span className="font-roboto font-semibold text-lg">{title}</span>
        </AccordionHeader>
        <AccordionPanel className="px-10">{children}</AccordionPanel>
      </AccordionItem>
    );
  }
  