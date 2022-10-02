// This is a generic modal, meaning it shall work with any children component passed as a prop to it.
// Material UI Modal

import { Fade, Modal } from '@mui/material';
import type { FC } from 'react';

// const style = {
//   position: 'relative' as const,
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

interface Props {
  children: React.ReactNode;
  open: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GenericModal: FC<Props> = (props) => {
  const { children, open, setModalOpen } = props;

  const handleClose = () => setModalOpen(false);

  return (
    <Modal open={open} onClose={handleClose}>
      <Fade in={open}>
        <div className='mx-48 my-16 items-center overflow-auto rounded-lg bg-white p-6'>
          {children}
        </div>
      </Fade>
    </Modal>
  );
};

export default GenericModal;
