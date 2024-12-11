FROM docker.io/bitnami/odoo:17

RUN /opt/bitnami/odoo/venv/bin/pip install PyJWT==2.6.0 escpos

