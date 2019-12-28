var texts = [
    {
        title: "Política de privacidad",
        text: "Cuando utilizas los servicios de TournamentJS, nos confías tu información. " +
        "El objetivo de esta Política de privacidad es informarte sobre los datos que recogemos.",
    },
    {
        title: "Política de privacidad de TournamentJS",
        text: "TournamentJS, como titular y gestor del sitio web que visitas, expone en este apartado la Política de Privacidad en el uso, y sobre la información de carácter personal que el usuario puede facilitar cuando visite o navegue por la página web de nuestra titularidad." +
        "" +
        "En el tratamiento de datos de carácter personal, se garantiza el cumplimiento de la Ley Orgánica 15/1999, de 13 de diciembre, de Protección de Datos de Carácter Personal y su normativa de desarrollo, Real Decreto 1720/2007, de 21 de diciembre, por el que se aprueba su Reglamento, así como la LSSICE 34/2002, del 11 de julio, de la Sociedad de la Información y de Comercio Electrónico. Por lo que informa a todos los usuarios, que los datos remitidos o suministrados a través de la presente serán incorporados a un fichero automatizado debidamente inscrito en la Agencia Española de Protección de Datos, en el que el responsable de dicho fichero es: TournamentJS con NIF: 0000000X y domicilio social: C/ INVENTADA 47015-VALLADOLID." +
        "TournamentJS se reserva el derecho de modificar la presente Política de Protección de Datos en cualquier momento, con el fin de adaptarla a novedades legislativas o cambios en sus actividades, siendo vigente la que en cada momento se encuentre publicada en nuestra web.",
    },
    {
        title: "Calidad y Finalidad",
        text: "Al hacer “click” en el botón “Enviar” (o equivalente) incorporado en nuestros formularios, el usuario declara que la información y los datos que en ellos ha facilitado son exactos y veraces. Para que la información facilitada esté siempre actualizada y no contenga errores, el Usuario deberá comunicar, a la mayor brevedad posible, las modificaciones de sus datos de carácter personal que se vayan produciendo, así como las rectificaciones de datos erróneos en caso de que detecte alguno. El Usuario garantiza que los datos aportados son verdaderos, exactos, completos y actualizados, siendo responsable de cualquier daño o perjuicio, directo o indirecto, que pudiera ocasionarse como consecuencia del incumplimiento de tal obligación. En función del formulario y/o correo electrónico al que accedas, o remitas, la información que nos facilites se utilizará para las finalidades descritas a continuación, por lo que aceptas expresamente y de forma libre e inequívoca su tratamiento con acuerdo a las siguientes finalidades:" +
        "" +
        "Las que particularmente se indiquen en cada una de las páginas donde aparezca el formulario de registro electrónico." +
        "Con carácter general, para atender tus solicitudes, consultas, comentarios, encargos o cualquier tipo de petición que sea realizada por el usuario a través de cualquiera de las formas de contacto que ponemos a disposición de nuestros usuarios, seguidores o lectores." +
        "Para informarte sobre consultas, peticiones, actividades, productos, novedades y/o servicios; vía e-mail, fax, Whatsapp, Skipe, teléfono proporcionado, comunidades sociales (Redes Sociales), y de igual forma para enviarle comunicaciones comerciales a través de cualesquier otro medio electrónico o físico. Estas comunicaciones, siempre serán relacionadas con nuestros tema, servicios, novedades o promociones, así como aquellas que considerar de su interés y que puedan ofrecer colaboradores, empresas o partners con los que mantengamos acuerdos de promoción comercial. De ser así, garantizamos que estos terceros nunca tendrán acceso a sus datos personales. Siendo en todo caso estas comunicaciones realizadas por parte de TournamentJS, y siempre sobre productos y servicios relacionados con nuestro sector." +
        "Elaborar perfiles de mercado con fines publicitarios o estadísticos." +
        "Esa misma información podrá ofrecérsele o remitírsele al hacerse seguidor de los perfiles de TournamentJS en las redes sociales que enlazan este Sitio Web, por lo que al hacerte seguidor de cualquiera de los dos consientes expresamente el tratamiento de tus datos personales dentro del entorno de estas redes sociales, en cumplimiento de las presentes, así como de las condiciones particulares y políticas de privacidad de las mismas. Si desean dejar de recibir dicha información o que esos datos sean cancelados, puedes darte de baja como seguidor de nuestros perfiles en estas redes. Además, los seguidores en redes sociales podrán ejercer los derechos que la Ley les confiere, si bien, puesto que dichas plataformas pertenecen a terceros, las respuestas a los ejercicios de derechos por parte de TournamentJS quedarán limitadas por las funcionalidades que permita la red social de que se trate, por lo que recomendamos que antes de seguir nuestros perfiles en redes sociales revises las condiciones de uso y políticas de privacidad de las mismas.",
    },
    {
        title: "Datos de Terceros",
        text: "En el supuesto de que nos facilites datos de carácter personal de terceras personas, en cumplimiento de lo dispuesto en el artículo 5.4. LOPD, declaras haber informado a dichas personas con carácter previo, del contenido de los datos facilitados, de la procedencia de los mismos, de la existencia y finalidad del fichero donde se contienen sus datos, de los destinatarios de dicha información, de la posibilidad de ejercitar los derechos de acceso, rectificación, cancelación u oposición, así como de los datos identificativos de tournamentJS En este sentido, es de su exclusiva responsabilidad informar de tal circunstancia a los terceros cuyos datos nos va a ceder, no asumiendo tournamentJS ninguna responsabilidad por el incumplimiento de este precepto por parte del usuario." +
        ""
    },
    {
        title: "Ejercicio de derechos",
        text: "El titular de los datos podrá ejercer sus derechos de acceso, rectificación, cancelación y oposición dirigiéndose a tournamentJS: alberto.hdzhdz@gmail.com. Dicha solicitud deberá contener los siguientes datos: nombre y apellidos, domicilio a efecto de notificaciones, fotocopia del DNI I o Pasaporte." +
        "",
    },
    {
        title: "Medidas de seguridad",
        text: "tournamentJS ha adoptado todas las medidas técnicas y de organización necesaria para garantizar la seguridad e integridad de los datos de carácter personal que trate, así como para evitar su pérdida, alteración y/o acceso por parte de terceros no autorizados. No obstante lo anterior, el usuario reconoce y acepta que las medidas de seguridad en Internet no son inexpugnables." +
        "" +
        "Este sitio web utiliza cookies para mejorar su experiencia. Asumiremos que está de acuerdo, pero puede optar por no hacerlo si lo desea."
    }
];

var lMargin=15;
var rMargin=15;
var pdfInMM=210;

$(function(){
    $("#html2pdf").on('click', function(){
        var pos = 20;
        var doc = new jsPDF("p", "mm", "a4");
        for(let i=0; i < texts.length; i++){
            var lines = doc.splitTextToSize(texts[i].text, (pdfInMM-lMargin-rMargin));
            console.log("lineas: " + lines.length + "pos: " + pos);
            doc.setFontSize(20);
            doc.text(texts[i].title, lMargin, pos);
            pos+=6;
            doc.setFontSize(6);
            doc.text(lMargin, pos,lines);
            pos+= 5 * lines.length / 1.15;
            //doc.text(texts[i].text, 20, pos2);
        }
        var string = doc.output('datauristring');
        var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
        var x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();
    });
});