import { motion } from "framer-motion";

function DropdownTransition({ children }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default DropdownTransition;
