import React, {useState} from "react";

const EmailConfirm = ({data, onSubmit}) =>{
    const [code, setCode] = useState('');

    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    return (
        <div>
          <p>{`На почту ${data.email} отправлено письмо подтверждения.`}</p>
          <label>Введите код из письма: </label>
          <form onSubmit={onSubmit}>
              <div>
                  <input
                      placeholder="Код подтверждения"
                      type="code"
                      id="code"
                      name="code"
                      value={code}
                      onChange={handleCodeChange}
                      maxLength={5}
                      required
                  />
              </div>
              <button className= "login-but" type="submit">Подтвердить</button>
          </form>
        </div>
    )
}

export default EmailConfirm