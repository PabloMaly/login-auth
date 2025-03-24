import { useEffect, useState } from 'react'
import { Img } from 'react-image';
import { createClient } from '@supabase/supabase-js'
import Login from './components/Auth/Login'

import './index.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string, name: string, image: string } | null>(null);

  useEffect(() => {
    setIsAuthenticated(false);
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session)
      if (session?.user) {
        setIsAuthenticated(true);
        setUser({
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          image: session.user.user_metadata?.avatar_url || ''
        });
      }
    });
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSocialLogin = (session: any) => {
    if (session) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      console.error('Error cerrando sesión:', error.message);
    } else {
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {isAuthenticated ? (
        <div className="container mx-auto p-8">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
              <Img 
                src={[user?.image || 'https://fakeimg.pl/600x400']} 
                className='rounded-4xl h-15 w-15 mr-2 inline-block'
                loader={<div>Loading...</div>} 
                unloader={<div>Error.</div>}/>
                Welcome, {user?.name}
              </h1>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-neutral-200 px-4 py-2 text-sm hover:cursor-pointer font-medium text-neutral-700 hover:bg-neutral-300"
              >
                Logout {user?.email}
              </button>
            </div>
            <p className="mt-4 text-neutral-600">
              You have successfully logged in!
            </p>
          </div>
        </div>
      ) : (
        <Login onLogin={handleLogin} onSocialLogin={handleSocialLogin} />
      )}
    </div>
  )
}

export default App 