import DesktopOSHeader from '@/components/sections/desktop-os-header';
import MainContentArea from '@/components/sections/main-content-area';
import ToDoNote from '@/components/sections/to-do-note';
import ProjectFolders from '@/components/sections/project-folders';
import DesktopFiles from '@/components/sections/desktop-files';
import Dock from '@/components/sections/dock';
import DraggableNote from '@/components/sections/draggable-note';
import BackgroundMedia from '@/components/sections/background-media';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#F5F5F7] overflow-hidden">
      <BackgroundMedia />
      <div className="relative z-10">
        {/* OS Header */}
        <DesktopOSHeader />
        
        {/* Main Desktop Area */}
        <div className="relative pt-[22px] h-screen">
          {/* Central Welcome Content */}
          <MainContentArea />
          
          {/* To-do Note: draggable (resets on refresh) */}
          <DraggableNote>
            <ToDoNote />
          </DraggableNote>
          
          {/* Desktop Files scattered across desktop */}
          <DesktopFiles />
          
          {/* Project Folders on the right side */}
          <ProjectFolders />
        </div>
        
        {/* Dock at bottom */}
        <Dock />
      </div>
    </div>
  );
}