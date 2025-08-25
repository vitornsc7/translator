package com.example.weather_viewer.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.weather_viewer.Service.KlingonService;

@RestController
@RequestMapping("/translate")
public class TranslateController {
    @Autowired
    private  KlingonService klingonService;


    // GET http://localhost:8080/translate/klingon?text=ola%20teste
    @GetMapping("/klingon")
    public ResponseEntity<TranslationResult> translateToKlingon(@RequestParam String text) {
        String translated = klingonService.traduzPraKlingon(text);
        return ResponseEntity.ok(new TranslationResult(text, translated, "klingon"));
    }

    public record TranslationResult(String original, String translated, String translation) {}

    // (Opcional) Propaga status e mensagem de erros vindos do service (ex.: 429 da FunTranslations)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
    }
}
