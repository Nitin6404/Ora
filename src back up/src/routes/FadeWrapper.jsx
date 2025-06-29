import { motion } from 'framer-motion';

const FadeWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }} // ← Longer and smoother
      className="w-full h-full bg-[#f1f1fd]"
      style={{
          // background: "linear-gradient(90deg,rgba(235, 233, 254, 1) 0%, rgba(253, 253, 253, 1) 50%, rgba(254, 246, 232, 1) 100%)",
          backgroundImage: `url("/dashboard-bg.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
    >
      {children}
    </motion.div>
  );
};

export default FadeWrapper;
