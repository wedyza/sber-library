import { Link, useLocation, useNavigate } from 'react-router-dom';
import './VerifyPage.scss'
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createOtp, validateOtp } from '../../features/auth/authSlice';

const VerifyPage = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(59);
  const [resendIndex, setResendIndex] = useState(0);
  const { step } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  
  const handleValidateOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    dispatch(validateOtp({ email, otp: code }));
  };

  useEffect(() => {
    if (step !== "otp") return;

    setTimer(59);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, resendIndex]);

  const handleResend = () => {
    if (!email) return;
    dispatch(createOtp(email));
    setResendIndex(prev => prev + 1);
  };
      
  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <div className='page-login page-verify'>
      <Link to={'/login'} className='verify_back'>
        <div className='verify_back-icon'>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.57496 0.29074C5.34102 -0.0268896 4.89389 -0.0947391 4.57626 0.139194C4.32955 0.320898 4.09503 0.502641 3.89078 0.662044C3.48302 0.980262 2.93694 1.41834 2.38877 1.89429C1.84415 2.36716 1.28112 2.89146 0.84863 3.38094C0.633107 3.62486 0.434901 3.87697 0.286705 4.1228C0.150328 4.34902 2.80986e-06 4.65986 0 4.99995C2.80986e-06 5.34003 0.150328 5.6509 0.286705 5.87712C0.434901 6.12295 0.633107 6.37505 0.84863 6.61898C1.28112 7.10845 1.84415 7.63275 2.38877 8.10563C2.93694 8.58158 3.48302 9.01965 3.89078 9.33787C4.09503 9.49728 4.32955 9.67902 4.57626 9.86072C4.89389 10.0947 5.34102 10.0268 5.57496 9.70918C5.66899 9.58149 5.71426 9.43288 5.71414 9.2856V4.99995V0.714314C5.71426 0.567035 5.66899 0.418422 5.57496 0.29074Z" fill="#808990"/>
          </svg>
        </div>
        <span className='verify_back-text semibold-16'>
          Назад
        </span>
      </Link>
      <h1 className='verify_title text-h1'>
        Введите код
      </h1>
      <p className="verify_email-label reg-16">
        Который мы отправили на ваш email:
      </p>
      <p className="verify_email-value semibold-18">
        {email}
      </p>
      <div className="login_inputs login_inputs__verify">
        <div className="login_input-group">
          <span className='login_label med-14'>
            Код
          </span>
          <input 
            type="text"
            className='login_input-email login_input reg-16'
            placeholder='_ _ _ _ _ _'
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
      </div>

      {timer > 0 ? (
        <div className="login-modal_repeat">
          <div className="login-modal_repeat-img">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4.41667C6 4.04848 6.29848 3.75 6.66667 3.75C7.03486 3.75 7.33333 4.04848 7.33333 4.41667C7.33333 4.78486 7.03486 5.08333 6.66667 5.08333C6.29848 5.08333 6 4.78486 6 4.41667ZM6 6.66667C6 6.29848 6.29848 6 6.66667 6C7.03486 6 7.33333 6.29848 7.33333 6.66667V9.33333C7.33333 9.70152 7.03486 10 6.66667 10C6.29848 10 6 9.70152 6 9.33333V6.66667ZM6.66 0C2.98 0 0 2.98667 0 6.66667C0 10.3467 2.98 13.3333 6.66 13.3333C10.3467 13.3333 13.3333 10.3467 13.3333 6.66667C13.3333 2.98667 10.3467 0 6.66 0ZM6.66667 12C3.72 12 1.33333 9.61333 1.33333 6.66667C1.33333 3.72 3.72 1.33333 6.66667 1.33333C9.61333 1.33333 12 3.72 12 6.66667C12 9.61333 9.61333 12 6.66667 12Z" fill="#B0B0B0"/>
            </svg>
          </div>
          <p className="login-modal_repeat-text inter14-400">Мы отправили код на ваш email. <br />Получить новый можно через 00:{timer}</p>
        </div>
      ) : (
        <button 
          className="grey-btn semibold-18 verify_resend"
          onClick={handleResend}
        >
          Получить новый код
        </button>
      )}

      <button 
        className='login_btn semibold-18 btn-accent'
        onClick={handleValidateOtp}
      >
        Войти
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

export default VerifyPage;