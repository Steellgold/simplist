// taken from Novel.sh github repo
import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
  Placeholder,
  AIHighlight
} from "novel/extensions";
import { UploadImagesPlugin } from "novel/plugins";

import { cx } from "class-variance-authority";

//TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects
const aiHighlight = AIHighlight;
//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
    )
  }
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200")
      })
    ];
  }
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted")
  }
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted")
  }
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2 ")
  }
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4")
  },
  nested: true
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground")
  }
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-3 -mt-2")
    }
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2")
    }
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2")
    }
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-primary")
    }
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx(
        "rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium",
      )
    }
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded-md bg-muted  px-1.5 py-1 font-mono font-medium"),
      spellcheck: "false"
    }
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4
  },
  heading: {
    levels: [1, 2, 3, 4, 5, 6],
    HTMLAttributes: {
      class: cx(
        "font-bold text-lg text-primary leading-8 mt-8 mb-4"
      )
    }
  },
  italic: {
    HTMLAttributes: {
      class: cx("italic")
    }
  },
  bold: {
    HTMLAttributes: {
      class: cx("font-bold")
    }
  },
  hardBreak: {
    HTMLAttributes: {
      class: cx("text-muted-foreground")
    }
  },
  paragraph: {
    HTMLAttributes: {
      class: cx("leading-7")
    }
  },
  strike: {
    HTMLAttributes: {
      class: cx("line-through")
    }
  },
  gapcursor: false
});

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight
];