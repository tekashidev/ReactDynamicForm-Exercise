import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import axios from 'axios';
import './Register.css';

const RegisterForm = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countryOptions = response.data.map(country => ({
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={country.flags.svg}
                alt={country.name.common}
                style={{ width: '20px', marginRight: '10px' }}
              />
              {country.name.common}
            </div>
          ),
          value: country.name.common,
        }));
        setCountries(countryOptions);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      birthDate: '',
      country: '',
      gender: '',
      marketingConsent: false,
      termsConsent: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, 'Imię musi mieć co najmniej 2 znaki')
        .matches(/^[a-zA-Z]+$/, 'Imię może zawierać tylko litery')
        .required('Imię jest wymagane'),
      lastName: Yup.string()
        .min(2, 'Nazwisko musi mieć co najmniej 2 znaki')
        .matches(/^[a-zA-Z]+$/, 'Nazwisko może zawierać tylko litery')
        .required('Nazwisko jest wymagane'),
      email: Yup.string()
        .email('Nieprawidłowy adres email')
        .required('Email jest wymagany'),
      password: Yup.string()
        .min(8, 'Hasło musi mieć co najmniej 8 znaków')
        .matches(/\d{2,}/, 'Hasło musi zawierać co najmniej 2 cyfry')
        .matches(/[!@#$%^&*(),.?":{}|<>]{3,}/, 'Hasło musi zawierać co najmniej 3 znaki specjalne')
        .required('Hasło jest wymagane'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Hasła muszą się zgadzać')
        .required('Potwierdzenie hasła jest wymagane'),
      age: Yup.number()
        .min(18, 'Minimalny wiek to 18')
        .max(99, 'Maksymalny wiek to 99')
        .required('Wiek jest wymagany'),
      birthDate: Yup.date()
        .required('Data urodzenia jest wymagana')
        .test('age-match', 'Data urodzenia nie zgadza się z wiekiem', function (value) {
          if (!value) return false;
          const ageFromBirthDate = Math.floor((new Date() - new Date(value)) / (1000 * 60 * 60 * 24 * 365.25));
          return ageFromBirthDate === this.parent.age;
        }),
      country: Yup.string().required('Kraj jest wymagany'),
      termsConsent: Yup.bool().oneOf([true], 'Musisz zaakceptować regulamin'),
    }),
    onSubmit: (values) => {
      console.log('Dane z formularza:', values);
      alert('Rejestracja zakończona sukcesem!');
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label>Imię</label>
        <input
          type="text"
          name="firstName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <div>{formik.errors.firstName}</div>
        ) : null}
      </div>

      <div>
        <label>Nazwisko</label>
        <input
          type="text"
          name="lastName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <div>{formik.errors.lastName}</div>
        ) : null}
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div>{formik.errors.email}</div>
        ) : null}
      </div>

      <div>
        <label>Hasło</label>
        <input
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : null}
      </div>

      <div>
        <label>Potwierdź hasło</label>
        <input
          type="password"
          name="confirmPassword"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div>{formik.errors.confirmPassword}</div>
        ) : null}
      </div>

      <div>
        <label>Wiek</label>
        <input
          type="number"
          name="age"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.age}
        />
        {formik.touched.age && formik.errors.age ? (
          <div>{formik.errors.age}</div>
        ) : null}
      </div>

      <div>
        <label>Data urodzenia</label>
        <input
          type="date"
          name="birthDate"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.birthDate}
        />
        {formik.touched.birthDate && formik.errors.birthDate ? (
          <div>{formik.errors.birthDate}</div>
        ) : null}
      </div>

      <div>
        <label>Kraj</label>
        <Select
          options={countries}
          onChange={(option) => formik.setFieldValue('country', option.value)}
          onBlur={() => formik.setFieldTouched('country', true)}
        />
        {formik.touched.country && formik.errors.country ? (
          <div>{formik.errors.country}</div>
        ) : null}
      </div>

      <div>
        <label>Płeć</label>
        <select
          name="gender"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.gender}
        >
          <option value="">Wybierz</option>
          <option value="male">Mężczyzna</option>
          <option value="female">Kobieta</option>
          <option value="other">Inna</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="marketingConsent"
            onChange={formik.handleChange}
            checked={formik.values.marketingConsent}
          />
          Wyrażam zgodę na komunikację marketingową
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="termsConsent"
            onChange={formik.handleChange}
            checked={formik.values.termsConsent}
          />
          Akceptuję regulamin
        </label>
        {formik.touched.termsConsent && formik.errors.termsConsent ? (
          <div>{formik.errors.termsConsent}</div>
        ) : null}
      </div>

      <button type="submit">Zarejestruj się</button>
    </form>
  );
};

export default RegisterForm;
