package com.example.weather_viewer.Service;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Service
public class KlingonService {

    @Autowired
    private RestTemplate rest;

    public String traduzPraKlingon(String textoOriginal) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("text", textoOriginal);

        HttpEntity<MultiValueMap<String, String>> req = new HttpEntity<>(form, headers);

        try {
            ResponseEntity<KlingonResponse> resp = rest.postForEntity(
                    "https://api.funtranslations.com/translate/klingon.json",
                    req,
                    KlingonResponse.class
            );

            KlingonResponse body = resp.getBody();
            if (resp.getStatusCode().is2xxSuccessful() && body != null && body.contents() != null) {
                return body.contents().translated();
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Resposta inesperada da FunTranslations.");

        } catch (HttpStatusCodeException e) {
            String errorBody = e.getResponseBodyAsString(StandardCharsets.UTF_8);
            HttpStatus status = HttpStatus.resolve(e.getRawStatusCode());
            throw new ResponseStatusException(status != null ? status : HttpStatus.BAD_GATEWAY,
                    "FunTranslations retornou " + e.getRawStatusCode() + ": " + errorBody, e);

        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.GATEWAY_TIMEOUT,
                    "Timeout ao chamar FunTranslations.", e);

        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Falha ao chamar FunTranslations.", e);
        }
    }

    public record KlingonResponse(Success success, Contents contents) {

    }

    public record Success(int total) {

    }

    public record Contents(String translated, String text, String translation) {

    }
}
