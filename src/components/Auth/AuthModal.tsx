import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onAuthSuccess }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSuccess = () => {
    onAuthSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {isLogin ? (
          <LoginForm 
            onSuccess={handleSuccess}
            onToggleMode={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm 
            onSuccess={handleSuccess}
            onToggleMode={() => setIsLogin(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;