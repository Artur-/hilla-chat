package org.vaadin.artur.hillachat;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.EmitResult;
import reactor.core.publisher.Sinks.Many;

@Endpoint
@AnonymousAllowed
public class ChatEndpoint {

    private Many<String> chatSink;

    public ChatEndpoint() {
        chatSink = Sinks.many().multicast().directBestEffort();
    }

    public void send(@Nonnull String message) {
        chatSink.emitNext(message, (signalType, emitResult) -> (emitResult == EmitResult.FAIL_NON_SERIALIZED));
    }

    @Nonnull
    public Flux<@Nonnull String> join() {
        return chatSink.asFlux();
    }
}