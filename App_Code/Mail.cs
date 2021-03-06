﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Net;
using System.Net.Mail;
using System.Configuration;
using System.Text;
using Newtonsoft.Json;

/// <summary>
/// SendMail
/// </summary>
[WebService(Namespace = "http://igprog.hr/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class Mail : System.Web.Services.WebService {
    string myEmail = ConfigurationManager.AppSettings["myEmail"];
    string myEmailName = ConfigurationManager.AppSettings["myEmailName"];
    string myPassword = ConfigurationManager.AppSettings["myPassword"];
    int myServerPort = Convert.ToInt32(ConfigurationManager.AppSettings["myServerPort"]);
    string myServerHost = ConfigurationManager.AppSettings["myServerHost"];
    string sendTo = ConfigurationManager.AppSettings["sendTo"];

    public Mail() {
    }

    public class NewMail {
        public string name;
        public string email;
        public string msg;
        public string subject;
        public string resp;
    }

    [WebMethod]
    public string Init() {
        NewMail x = new NewMail();
        x.name = null;
        x.email = null;
        x.msg = null;
        x.subject = null;
        x.resp = null;
        return JsonConvert.SerializeObject(x, Formatting.None);
    }

    [WebMethod]
    public string Send(NewMail x) {
       string messageBody = string.Format(
@"
<hr>Novi upit</h3>
<p>Ime: {0}</p>
<p>Email: {1}</p>
<p>Poruka: {2}</p>", x.name, x.email, x.msg);
        x.resp = SendMail(sendTo, x.subject, messageBody);
        return JsonConvert.SerializeObject(x, Formatting.None);
    }

    [WebMethod]
    public string Test() {
        return JsonConvert.SerializeObject("Test OK", Formatting.None);
    }

    public string SendMail(string sendTo, string messageSubject, string messageBody) {
        try {
            MailMessage mailMessage = new MailMessage();
            SmtpClient Smtp_Server = new SmtpClient();
            Smtp_Server.UseDefaultCredentials = false;
            Smtp_Server.Credentials = new NetworkCredential(myEmail, myPassword);
            //Smtp_Server.Port = myServerPort;
            //Smtp_Server.EnableSsl = true;
            Smtp_Server.Host = myServerHost;
            mailMessage.To.Add(sendTo);
            mailMessage.From = new MailAddress(myEmail, myEmailName);
            mailMessage.Subject = messageSubject;
            mailMessage.Body = messageBody;
            mailMessage.IsBodyHtml = true;
            Smtp_Server.Send(mailMessage);
            return "OK";
        } catch (Exception e) {
            return e.Message;
        }
    }

    

}
