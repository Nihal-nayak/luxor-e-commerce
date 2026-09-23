package com.luxor.shoppingcartapi.Security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtConfig {

    private String secret;
    private Long accessTokenExpiration;
    private Long RefreshTokenExpiration;
}
