import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.scss'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useEffect, useState } from 'react';
import { registerUser } from '../../features/auth/authSlice';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { step } = useAppSelector(state => state.auth);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName) return;
    dispatch(registerUser({
      email,
      firstName,
      lastName,
      middleName: middleName.length > 0 ? middleName : '',
      birthDate: birthDate || ''
    }));
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
    <div className='page-login page-register'>
      <h1 className='register_title text-h1'>
        Зарегистрируйтесь
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
        <div className="login_input-group">
          <span className='login_label med-14'>
            Фамилия
          </span>
          <input 
            type="text"
            className='login_input-email login_input reg-16'
            placeholder='Фамилия'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="login_input-group">
          <span className='login_label med-14'>
            Имя
          </span>
          <input 
            type="text"
            className='login_input-email login_input reg-16'
            placeholder='Имя'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="login_input-group">
          <span className='login_label med-14'>
            Отчество
          </span>
          <input 
            type="text"
            className='login_input-email login_input reg-16'
            placeholder='Отчество'
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>
        <div className="login_input-group">
          <span className='login_label med-14'>
            Дата рождения
          </span>
          <input 
            type="date"
            className='login_input-email login_input reg-16'
            placeholder='__. / __. / ____'
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
      </div>
      <button 
        className='login_btn semibold-18 btn-accent'
        onClick={handleRegister}
      >
        Получить код
      </button>
      <div className='login_to-reg med-14'>
        <p className='login_to-reg__text'>
          Уже есть аккаунт?
        </p>
        <Link to={'/login'} className='login_to-reg__link'>
          Войдите в него!
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage;