"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Component } from "@/components/utils/component";
import { LANGUAGES } from "@/utils/lang";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import type { Lang as LANG } from "@prisma/client";
import { Languages } from "lucide-react";

export type Lang = {
  value: LANG;
  label: string;
}

type Props = {
  setLang: (lang: Lang) => void;
}

export const LangSelector: Component<Props> = ({ setLang }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedLang, setSLang] = useState<Lang | null>({
    value: "EN",
    label: LANGUAGES.EN
  });

  const setSelectedLang = (lang: Lang | null): void => {
    setLang(lang as Lang);
    setSLang(lang);
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] flex justify-start gap-1">
            <Languages size={16} />&nbsp;
            {selectedLang ? <>{selectedLang.label}</> : <>Choose language</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <LangList setOpen={setOpen} setSelectedLang={setSelectedLang} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start flex gap-1">
          <Languages size={16} />&nbsp;
          {selectedLang ? <>{selectedLang.label}</> : <>Choose language</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <LangList setOpen={setOpen} setSelectedLang={setSelectedLang} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

type LangListProps = {
  setOpen: (open: boolean) => void;
  setSelectedLang: (lang: Lang | null) => void;
}

const LangList: Component<LangListProps> = ({ setOpen, setSelectedLang }) => {
  return (
    <Command>
      <CommandInput placeholder="Search languages..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Object.entries(LANGUAGES).map(([value, label]) => (
            <CommandItem
              key={value}
              onSelect={() => {
                console.log(value);
                setSelectedLang({ value: value as LANG, label });
                setOpen(false);
              }}>
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};