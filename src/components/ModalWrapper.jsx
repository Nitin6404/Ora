import { ArrowLeft } from 'lucide-react';

const ModalWrapper = ({ isOpen, onClose, Header, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3rem)] w-full z-[9999]">
        <div className="fixed inset-0 overflow-hidden backdrop-blur-2xl z-[100] m-4 border-[2px] rounded-[16px] border-[#7367f0] no-scrollbar">
          <div className="min-h-screen flex flex-col backdrop-blur-2xl overflow-hidden rounded-2xl shadow-2xl h-full w-full no-scrollbar px-6 py-3 pb-12 space-y-2">
            {/* Header */}
            <div className="bg-transparent rounded-t-2xl flex justify-between items-center">
              <button
                onClick={onClose}
                className="flex justify-center items-center text-gray-600 hover:text-gray-800 bg-white/70 px-3 py-1 rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              {Header}
            </div>
  
            {/* Main Content */}
            <div className="h-full py-2 overflow-y-auto lg:overflow-hidden no-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ModalWrapper;
  