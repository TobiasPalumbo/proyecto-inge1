package com.grupo56.proyectoIngeBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class CorreoServiceImp {
	private JavaMailSender mailSender;
	  @Autowired
	    public CorreoServiceImp(JavaMailSender mailSender) {
	        this.mailSender = mailSender;
	    }
	public void enviarCodigo(String mail, String codigo) {
		
		//ACA EL METODO PARA ENVIAR EL MAIL, PERO NO ANDA PORQUE JAVA NO VALIDA EL CERTIFICADO SSL DE GMAIL TOCA ARREGLARLO 
		
		/*SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Código de verificación");
        mensaje.setText("Tu código de verificación es: " + codigo);
        mailSender.send(mensaje);
		
		*/
	}

}
