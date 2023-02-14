-- setup
-- depends:

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE FUNCTION updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

/************************ VENDORED **************************
 * Copyright 2022 Viascom Ltd liab. Co
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

-- This is an implementation of nanoid vendored from
-- https://github.com/viascom/nanoid-postgres.
CREATE FUNCTION generate_external_id(prefix text)
    RETURNS text
    LANGUAGE plpgsql
    volatile
AS $$
DECLARE
    -- With a size of 16 and this alphabet, we have 456 years @ 100k IDs
    -- generated per hour until we have a 1% probability of at least 1
    -- collision, per https://zelark.github.io/nano-id-cc/.
    size          int  := 16;
    alphabet      text := '0123456789abcdefghijklmnopqrstuvwxyz';
    idBuilder     text := '';
    i             int  := 0;
    bytes         bytea;
    alphabetIndex int;
    mask          int;
    step          int;
BEGIN
    mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
    step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

    while true
        loop
            bytes := gen_random_bytes(size);
            while i < size
                loop
                    alphabetIndex := (get_byte(bytes, i) & mask) + 1;
                    if alphabetIndex <= length(alphabet) then
                        idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);
                        if length(idBuilder) = size then
                            return prefix || '_' || idBuilder;
                        end if;
                    end if;
                    i = i + 1;
                end loop;

            i := 0;
        end loop;
END
$$;

/************************ END VENDORED **************************/
