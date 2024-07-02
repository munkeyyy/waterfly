import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khatrirohit198@gmail.com",
    pass: "aaew oljj zljz fdal",
  },
});

const sendInvoiceEmail = (email, invoicePath) => {
  const mailOptions = {
    from: "khatrirohit198@gmail.com",
    to: email,
    subject: "Your Invoice",
    text: "Please find attached your invoice.",
    attachments: [
      {
        filename: "invoice.pdf",
        path: invoicePath,
      },
    ],
  };
  transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        return console.log(error)
    }
    console.log('Email sent: ' + info.response);
  })
};


export default sendInvoiceEmail
