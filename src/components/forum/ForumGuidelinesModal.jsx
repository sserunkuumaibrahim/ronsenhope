import { useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-hot-toast';

const ForumGuidelinesModal = ({ isOpen, onClose, onAccept }) => {

  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const guidelinesContent = `We'd like to be a place for all who care about supporting vulnerable children and families. Share experiences, offer encouragement, and give tips to help others.

Our Values
We are a community that treats all people with kindness and understanding. We ask that everyone using our discussion forums act with these values in mind:

Respect. The vulnerability of sharing our experiences brings us together and carries us through the most challenging times. The feelings and opinions of all people are honored and valued, even in disagreement.

Inclusivity. Ronsen Hope Christian Foundation Uganda welcomes all people who care about supporting vulnerable children and families. All people are welcome here, without judgment, and no one shall be turned away or discouraged from participating.

Empathy. Every person is worthy and deserving of understanding and compassion. People often arrive unfiltered and with raw emotions. Be mindful of how your words and actions will be received by others.

Terms of Use
Ronsen Hope Community is designed to be a space for a thriving community concerned about supporting vulnerable children and families, and a comfortable place for visitors to find information, emotional support, and share experiences. Your use of Ronsen Hope Community is conditioned upon your continued acceptance of and compliance with our Terms of Use.

Guidelines for using the community discussion forums
Continued infringement of these rules can lead to temporary or permanent bans, so they must be followed and respected. These Rules are to protect you and our other members and are to be followed in all posts.

Be upfront about who you are and why you are here. We want our members to feel comfortable posting and sharing here, and knowing that the people they're talking to "get it" goes a long way toward making that happen.

Say hello and introduce yourself. If you are new, write a post to introduce yourself. If you see someone else is new, say hello. Share as much of your story as you're comfortable with.

Remember the forums are public. If you do not wish to use your real name, choose a unique username. We discourage members from posting any personally identifying information; such as phone numbers, email addresses, or home or work addresses. The level of anonymity you choose to operate under is up to you. For your safety and the safety of the rest of the community, we encourage you to use caution when posting personal or private information.

We encourage you to like, post and comment on others' posts, or start your own new discussion. We will invite you to in surveys and answer questions that are asked of our members. However do not give any medical advice on these forums, rather share your experience but encourage others to speak with their doctor or schedule a session.

Ronsen Hope Community has a zero tolerance policy for bullying and/or abusive behavior. You must be respectful of every person's position. No name calling, no harassment, no personal attacks against other members or our moderators. Any violation of this policy will result in your immediate removal from the community discussion forums.

Imposters and people impersonating others or misrepresenting their connection to child welfare work will be removed.

Members are allowed one account and one account only, so please don't create multiple accounts for yourself. We'll delete additional accounts. If you forget your username or password, click "Reset your password" on the login page and follow the instructions.

Post your own ideas and thoughts. If you share something that doesn't belong to you or is copyrighted, make sure to cite your source. This also includes copyrighted images. Source and cite any studies, statistics, images, or information that you're sharing. If the source you cite is not reputable, the moderators may ask you to delete the post.

No cross-posting, please. Cross-posting means posting the same message in multiple categories or topics. Choose the single most appropriate category and topic for your post.

Spamming the forums or private messages with links, advertisements, or solicitations for businesses or services is not permitted. If we see spam or it is reported by other members, it will be removed and will result in the removal of your account.

If you offer a service that you think would be beneficial to community members, contact info@ronsenhopefoundation.org for review. You may not collect any information about or intellectual property from other members for your own use, personal or otherwise without the express written consent of Ronsen Hope Christian Foundation Uganda and its members. To obtain consent, please contact info@ronsenhopefoundation.org.

You may not upload or post files that contain viruses or worms that would harm members' computer software or data. You may not violate local, state, national, or international law in your use of the community discussion forums.

Ronsen Hope Community reserves the right to terminate or limit your access to the community without notice. In summary, please use common sense, treat others as you expect to be treated, and help us build a great community experience for everyone. Our moderators are here to welcome members, encourage connections, share useful information, and facilitate conversations. The content on the discussion forums is largely user generated. Therefore, Ronsen Hope doesn't endorse or take responsibility for the medical accuracy of the content on the discussion forums. We count on our members to encourage our values, follow guidelines, and protect the integrity of the discussions in our forums.

Please private message or email us at info@ronsenhopefoundation.org with any concerns you have. Read Ronsen Hope Community's Terms of Use.`;



  const handleCancel = () => {
    // Don't set localStorage when canceling - user should see guidelines again
    navigate('/');
    onClose();
  };

  const handleAccept = async () => {
    try {
      // Always set localStorage for quick future checks
      localStorage.setItem('hasSeenForumGuidelines', 'true');
      
      // If user is logged in, also update their Firebase document
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          hasReadForumGuidelines: true,
          guidelinesReadAt: new Date().toISOString()
        });
      }
      
      toast.success('Guidelines accepted! Welcome to the forum.');
      onAccept();
      onClose();
    } catch (error) {
      console.error('Error updating user guidelines status:', error);
      // Still allow users to proceed even if database update fails
      // localStorage is already set, so they won't see guidelines again
      toast.success('Guidelines accepted! Welcome to the forum.');
      onAccept();
      onClose();
    }
  };



  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && handleCancel()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Forum Guidelines</h2>
              <p className="text-sm text-gray-600 mt-1">
                Please read and accept our community guidelines to continue
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden relative">
            <div
              ref={scrollContainerRef}
              className="h-full overflow-y-auto p-6 prose prose-sm max-w-none"
              style={{ maxHeight: 'calc(90vh - 200px)' }}
            >
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {guidelinesContent}
              </div>
            </div>
            

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Ready to accept</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 rounded-lg font-medium transition-all bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg"
              >
                I Accept
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ForumGuidelinesModal;