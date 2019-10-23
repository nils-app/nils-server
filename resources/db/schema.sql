CREATE TABLE users (  
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    balance int DEFAULT 0 NOT NULL,
    transferwise_id int NULL,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (uuid)
);

CREATE TABLE user_email (  
    user_id UUID NOT NULL,
    email text NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (uuid) ON DELETE CASCADE,
    UNIQUE (email)
);

CREATE TABLE user_logins (  
    user_id UUID NOT NULL,
    auth_provider text NOT NULL,
    token text NOT NULL,
    PRIMARY KEY (user_id, auth_provider),
    FOREIGN KEY (user_id) REFERENCES users (uuid) ON DELETE CASCADE
);

CREATE TABLE domains (  
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    domain text NOT NULL,
    balance int DEFAULT 0 NOT NULL,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (uuid),
    FOREIGN KEY (user_id) REFERENCES users (uuid) ON DELETE RESTRICT
);

CREATE TABLE blocked_domains (  
    user_id UUID NOT NULL,
    domain_id UUID NOT NULL,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, domain_id),
    FOREIGN KEY (user_id) REFERENCES users (uuid) ON DELETE RESTRICT,
    FOREIGN KEY (domain_id) REFERENCES domains (uuid) ON DELETE CASCADE
);

CREATE TABLE payouts (
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    amount_nils int NOT NULL,
    amount_fiat int NOT NULL,
    currency text NOT NULL,
    sent_on timestamp with time zone NULL,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (uuid),
    FOREIGN KEY (user_id) REFERENCES users (uuid) ON DELETE RESTRICT
);

CREATE TABLE transactions (
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    domain_id UUID NOT NULL,
    amount_nils int NOT NULL,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (uuid),
    FOREIGN KEY (user_id) REFERENCES users (uuid) ON DELETE RESTRICT,
    FOREIGN KEY (domain_id) REFERENCES domains (uuid) ON DELETE CASCADE
);
