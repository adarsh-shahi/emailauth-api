// CREATE TABLE otp (
// 	id SERIAL PRIMARY KEY,
// 	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
// 	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
// 	token VARCHAR(500) NOT NULL UNIQUE,
// 	otp VARCHAR(20) NOT NULL
// )

const QsaveTokenOTP = (token, otp) => {
	return `
  INSERT INTO otp (token, otp) VALUES ('${token}', '${otp}');
  `;
};

const QgetOTP = (token) => {
	return `
  SELECT token, otp FROM otp WHERE token = '${token}';
  `;
};

const QupdateOTP = (token, otp) => {
	return `
  UPDATE otp SET otp = '${otp}' WHERE token = '${token}';
  `;
};
