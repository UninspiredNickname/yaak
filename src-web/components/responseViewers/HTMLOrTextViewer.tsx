import type { HttpResponse } from '@yaakapp-internal/models';
import { useResponseBodyText } from '../../hooks/useResponseBodyText';
import { languageFromContentType } from '../../lib/contentType';
import { getContentTypeFromHeaders } from '../../lib/model_util';
import { BinaryViewer } from './BinaryViewer';
import { TextViewer } from './TextViewer';
import { WebPageViewer } from './WebPageViewer';

interface Props {
  response: HttpResponse;
  pretty: boolean;
  textViewerClassName?: string;
}

export function HTMLOrTextViewer({ response, pretty, textViewerClassName }: Props) {
  const rawTextBody = useResponseBodyText(response);
  const contentType = getContentTypeFromHeaders(response.headers);
  const language = languageFromContentType(contentType, rawTextBody.data ?? '');

  if (rawTextBody.isLoading || response.state === 'initialized') {
    return null;
  }

  // Wasn't able to decode as text, so it must be binary
  if (rawTextBody.data == null) {
    return <BinaryViewer response={response} />;
  }

  if (language === 'html' && pretty) {
    return <WebPageViewer response={response} />;
  } else {
    return (
      <TextViewer
        language={language}
        text={rawTextBody.data}
        pretty={pretty}
        className={textViewerClassName}
        responseId={response.id}
        requestId={response.requestId}
      />
    );
  }
}
