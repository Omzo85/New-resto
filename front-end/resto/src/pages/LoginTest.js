import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from './Login';

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockSignup = jest.fn();
  const mockForgotPassword = jest.fn();
  const mockNavigate = jest.fn();

  const mockAuthContextValue = {
    login: mockLogin,
    signup: mockSignup,
    forgotPassword: mockForgotPassword,
    error: null,
    user: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
  });

  it('switches to signup form when "Créer un compte" is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText('Créer un compte'));

    expect(screen.getByText('Inscription')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Numéro de voie')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom de la voie')).toBeInTheDocument();
    expect(screen.getByLabelText('Code Postal')).toBeInTheDocument();
    expect(screen.getByLabelText('Ville')).toBeInTheDocument();
    expect(screen.getByText('Déjà inscrit ? Se connecter')).toBeInTheDocument();
  });

  it('switches to forgot password form when "Mot de passe oublié ?" is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText('Mot de passe oublié ?'));

    expect(screen.getByText('Mot de passe oublié ?')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Retour à la connexion')).toBeInTheDocument();
  });

  it('calls login function on form submission in login mode', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Se connecter'));

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('calls signup function on form submission in signup mode', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText('Créer un compte'));
    fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmer le mot de passe'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Numéro de voie'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Nom de la voie'), { target: { value: 'Rue de la Paix' } });
    fireEvent.change(screen.getByLabelText('Code Postal'), { target: { value: '75001' } });
    fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByText("S'inscrire"));

    expect(mockSignup).toHaveBeenCalledWith(
      'John',
      'Doe',
      'john.doe@example.com',
      'password123',
      '123',
      'Rue de la Paix',
      '75001',
      'Paris',
      'user'
    );
  });

  it('calls forgotPassword function on form submission in forgot password mode', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText('Mot de passe oublié ?'));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Envoyer le lien'));

    expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com');
  });
});