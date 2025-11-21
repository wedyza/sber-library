import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.scss'
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createOtp } from '../../features/auth/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const { step } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    dispatch(createOtp(email));
  };

  useEffect(() => {
    if (step === 'otp') {
      navigate('/verify-code', { 
        state: { 
          email,
          action: 'login'
        }
      });
    }
  }, [step]);

  return (
    <div className='page-login'>
      <h1 className='login_title text-h1'>
        Войдите
      </h1>
      <div className="login_inputs">
        <div className="login_input-group">
          <span className='login_label med-14'>
            Email
          </span>
          <input 
            type="email"
            className='login_input-email login_input reg-16'
            placeholder='Введите ваш Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <button className='login_btn semibold-18 btn-accent' onClick={handleRequestOtp}>
        Получить код
      </button>
      <div className='login_to-reg med-14'>
        <p className='login_to-reg__text'>
          Еще нет аккаунта?
        </p>
        <Link to={'/register'} className='login_to-reg__link'>
          Создайте его!
        </Link>
      </div>
    </div>
  )
}

export default LoginPage;