"use client";

import Image from "next/image";
import { useRef, type ReactNode, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring } from
"framer-motion";
import { FaSpotify } from "react-icons/fa";
import ContactWindow from "@/components/windows/contact-window";
import GalleryWindow from "@/components/windows/gallery-window";
import MessagesWindow from "@/components/windows/messages-window";

// Constants from design system / observation
const ICON_BASE_SIZE = 48; // Corresponds to `h-12 w-12`
const ICON_MAGNIFIED_SIZE = 80;
const ICON_LIFT_Y = -24;

const FramerBadge = () =>
<a
  href="https://www.linkedin.com/in/sameermistri/"
  target="_blank"
  rel="noopener noreferrer"
  title="Sam - Custom website builder for designers, agencies and startups."
  className="ml-4 flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1.5 text-black no-underline shadow-lg hover:shadow-xl transition-shadow">
    <span className="text-xs font-medium tracking-tight">Made by Sam</span>
  </a>;


interface DockIconProps {
  item: {id: string;alt: string;dot?: boolean;};
  mouseX: ReturnType<typeof useMotionValue<number>>;
  children: ReactNode;
  size: number;
  onClick?: () => void;
  label?: string; // optional hover label
}

const AnimatedDockIcon = ({
  item,
  mouseX,
  children,
  size,
  onClick,
  label
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const iconCenterX = ref.current ? ref.current.offsetLeft + size / 2 : 0;
    return val - iconCenterX;
  });

  const widthSync = useTransform(distance, (d) =>
  Math.abs(d) <= size / 2 ? ICON_MAGNIFIED_SIZE : size
  );
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const ySync = useTransform(distance, (d) =>
  Math.abs(d) <= size / 2 ? ICON_LIFT_Y : 0
  );
  const y = useSpring(ySync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div
      ref={ref}
      className="flex-shrink-0"
      style={{ width: `${size}px`, height: `${size}px` }}>

      <motion.div
        style={{ width, y }}
        className="relative mx-auto cursor-pointer group"
        onClick={onClick}>

        <div className="w-full relative" style={{ paddingTop: "100%" }}>
          {children}
        </div>
        {item.dot &&
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-400 rounded-full" />
        }
        {label && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-white/90 text-black text-[11px] px-2 py-1 shadow-md border border-black/10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
            {label}
          </div>
        )}
      </motion.div>
    </div>);

};

const DOCK_ITEMS = [
{ id: 'finder', alt: 'Finder', content: <Image src="https://framerusercontent.com/images/wtQkw1jK0MlEDOrW0Q1kE5PBqc.png" alt="Finder" fill className="object-contain" /> },
{ id: 'launchpad', alt: 'Launchpad', dot: true, content: <Image src="https://framerusercontent.com/images/KCaz69s4OvhKMUI25E1RBeuNIyA.png" alt="Launchpad" fill className="object-contain" /> },
{ id: 'safari', alt: 'Safari', dot: true, content: <Image src="https://framerusercontent.com/images/qQISGOSSnz748TdrZn91l44R5u0.png" alt="Safari" fill className="object-contain" /> },
{ id: 'messages', alt: 'Messages', content: <Image src="https://framerusercontent.com/images/fm90fwzWoBMCvK5C0MOyKdo94.png" alt="Messages" fill className="object-contain" /> },
{ id: 'mail', alt: 'Mail', content: <Image src="https://framerusercontent.com/images/CwKoPLck9kD8CifRkrpug3socM.png" alt="Mail" fill className="object-contain" /> },
{ id: 'maps', alt: 'Maps', content: <Image src="https://framerusercontent.com/images/YtLyrfz2kFN2QhkzBWG6TrATw.png" alt="Maps" fill className="object-contain" /> },
{ id: 'photos', alt: 'Photos', content: <Image src="https://framerusercontent.com/images/ogWIDEJmWxA8SVRZpEe7gk35FcM.png" alt="Photos" fill className="object-contain" /> },
{ id: 'facetime', alt: 'FaceTime', content: <Image src="https://framerusercontent.com/images/xxKf6tPzYecSWOavDJjUB0MtXw.png" alt="FaceTime" fill className="object-contain" /> },
{ id: 'calendar', alt: 'Calendar', content: <Image src="https://framerusercontent.com/images/VeljykK560qBRDkQkYyhx8ChI.png" alt="Calendar" fill className="object-contain" /> },
{ id: 'contacts', alt: 'Contacts', content: <Image src="https://framerusercontent.com/images/gi6dMq8dbjba0LyjZSuySu4X6zg.png" alt="Contacts" fill className="object-contain" /> },
{ id: 'reminders', alt: 'Reminders', content: <Image src="https://framerusercontent.com/images/NMuItXJj2OKiPiAC2EdivhRPYY.png" alt="Reminders" fill className="object-contain" /> },
{ id: 'notes', alt: 'Notes', content: <Image src="https://framerusercontent.com/images/Z0d1XNe7wVINUiHydSL6noKho.png" alt="Notes" fill className="object-contain" /> },
{ id: 'tv', alt: 'Apple TV', content: <Image src="https://framerusercontent.com/images/1pORyCnfgAxpXWyCa1l7s8IJeK0.png" alt="Apple TV" fill className="object-contain" /> },
{ id: 'music', alt: 'Music', content: <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7c0c911a-1ae7-40dd-8466-7ca3af5221e9-inikasdesktop-framer-website/assets/icons/pjjxP6KY1Ttnqhuqt9oF3QBfmE-15.png" alt="Music" fill className="object-contain" /> },
{ id: 'podcasts', alt: 'Podcasts', content: <Image src="https://framerusercontent.com/images/y6Unx5f6vZ4SwFJ4bnDpnejmKM.png" alt="Podcasts" fill className="object-contain" /> },
{ id: 'appstore', alt: 'App Store', content: <Image src="https://framerusercontent.com/images/mjYHu1WKSujuvzAuskfVJSx2w.png" alt="App Store" fill className="object-contain" /> },
{ id: 'system', alt: 'System Preferences', content: <Image src="https://framerusercontent.com/images/VbY44vBZlQp4srNQK6ohxpco.png" alt="System Preferences" fill className="object-contain" /> },
{ id: 'spotify', alt: 'Spotify', content: <div className="absolute inset-0 rounded-[22%] bg-[#1DB954] flex items-center justify-center"><FaSpotify className="text-white w-[60%] h-[60%]" /></div> },
{ id: 'divider', alt: 'divider', content: null },
{ id: 'folder', alt: 'Folder', content: <Image src="https://framerusercontent.com/images/lwNP7fGxNGl6VSwvqD3AorA1h0.png" alt="Folder" fill className="object-contain" /> },
{ id: 'trash', alt: 'Trash', content: <Image src="https://framerusercontent.com/images/XYN0Nl9HILu4c0bzhEPmjha0Cg.png" alt="Trash" fill className="object-contain" /> }];


export default function Dock() {
  const dockRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(Infinity);
  const [contactOpen, setContactOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  return (
    <>
      <footer className="fixed bottom-2 left-0 right-0 flex justify-center items-end h-[68px] z-50 pointer-events-none">
        <div className="flex items-end pointer-events-auto">
          <div
            ref={dockRef}
            onMouseMove={(e) => {
              if (dockRef.current)
              mouseX.set(e.clientX - dockRef.current.getBoundingClientRect().left);
            }}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="relative flex items-end h-[68px] px-3 pb-2 pt-2">

            <div className="absolute inset-0 h-full w-full pointer-events-none">
              <Image
                src="https://framerusercontent.com/images/iq88Gse4pPjrFei3Nusiq1wA.png"
                alt="Dock background"
                fill
                className="rounded-[1.3rem]" />

            </div>
            <div className="relative flex items-end justify-center h-full space-x-3">
              {DOCK_ITEMS.map((item) =>
              item.id === "divider" ?
              <div
                key={item.id}
                className="w-px h-12 self-center bg-white/20" /> :


              <AnimatedDockIcon
                key={item.id}
                item={{
                  ...item,
                  dot:
                  item.id === "contacts" ?
                  contactOpen :
                  item.id === "photos" ?
                  galleryOpen :
                  item.id === "messages" ?
                  messagesOpen :
                  item.dot
                }}
                mouseX={mouseX}
                size={ICON_BASE_SIZE}
                onClick=
                {item.id === "contacts" ?
                () => setContactOpen((v) => !v) :
                item.id === "photos" ?
                () => setGalleryOpen((v) => !v) :
                item.id === "messages" ?
                () => setMessagesOpen((v) => !v) :
                undefined}
                label={
                  item.id === "contacts" || item.id === "photos" || item.id === "messages"
                    ? "open me"
                    : undefined
                }>

                    {item.content}
                  </AnimatedDockIcon>

              )}
            </div>
          </div>
          <FramerBadge />
        </div>
      </footer>
      <ContactWindow open={contactOpen} onClose={() => setContactOpen(false)} />
      <GalleryWindow open={galleryOpen} onClose={() => setGalleryOpen(false)} />
      <MessagesWindow open={messagesOpen} onClose={() => setMessagesOpen(false)} />
    </>);

}