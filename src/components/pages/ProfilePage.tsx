import { useMember } from '@/integrations';
import { User, Mail, Calendar, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';

export default function ProfilePage() {
  const { member, actions } = useMember();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[120rem] mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8">
            User Profile
          </h1>

          <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-8">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-primary/20">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                {member?.profile?.photo?.url ? (
                  <Image src={member.profile.photo.url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-primary" />
                )}
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
                  {member?.profile?.nickname || member?.contact?.firstName || 'User'}
                </h2>
                <p className="font-paragraph text-sm text-muted-gray-foreground">
                  Inventory Manager
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-paragraph text-sm text-muted-gray-foreground mb-1">
                    Email Address
                  </p>
                  <p className="font-paragraph text-base text-foreground">
                    {member?.loginEmail || 'Not provided'}
                  </p>
                </div>
              </div>

              {member?.contact?.firstName && (
                <div className="flex items-start space-x-4">
                  <User className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-paragraph text-sm text-muted-gray-foreground mb-1">
                      Full Name
                    </p>
                    <p className="font-paragraph text-base text-foreground">
                      {member.contact.firstName} {member.contact.lastName || ''}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-paragraph text-sm text-muted-gray-foreground mb-1">
                    Member Since
                  </p>
                  <p className="font-paragraph text-base text-foreground">
                    {member?._createdDate
                      ? new Date(member._createdDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {member?.lastLoginDate && (
                <div className="flex items-start space-x-4">
                  <Calendar className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-paragraph text-sm text-muted-gray-foreground mb-1">
                      Last Login
                    </p>
                    <p className="font-paragraph text-base text-foreground">
                      {new Date(member.lastLoginDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-8 border-t border-primary/20">
              <button
                onClick={actions.logout}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-all duration-300 font-paragraph text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
