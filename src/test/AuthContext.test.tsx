import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    }
  }
}))

// Test component that uses useAuth
const TestComponent = () => {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  return <div>{user ? `User: ${user.email}` : 'No user'}</div>
}

const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides initial loading state', () => {
    renderWithProviders(<TestComponent />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows no user when not authenticated', async () => {
    renderWithProviders(<TestComponent />)
    
    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument()
    })
  })

  it('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = vi.fn()

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')

    console.error = originalError
  })
})