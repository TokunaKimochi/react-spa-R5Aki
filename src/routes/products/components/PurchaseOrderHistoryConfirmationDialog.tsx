import { Button, Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';

import { css } from 'styled-system/css';

interface PurchaseOrderHistoryConfirmationDialogProps {
  isOpen: boolean;
  isRegistering: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}

export default function PurchaseOrderHistoryConfirmationDialog({
  isOpen,
  isRegistering,
  onOpenChange,
  onConfirm,
}: PurchaseOrderHistoryConfirmationDialogProps) {
  return (
    <ModalOverlay
      isDismissable={!isRegistering}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={css({
        pos: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: '1rem',
        bg: 'rgba(0, 0, 0, 0.45)',
      })}
    >
      <Modal
        className={css({
          w: 'min(100%, 30rem)',
          '&[data-exiting]': { animation: 'depthFadeOut 150ms ease-in' },
        })}
      >
        <Dialog
          className={css({
            display: 'grid',
            gap: '1.5rem',
            p: '1.5rem',
            bg: 'white',
            color: 'stone.900',
            borderRadius: 'lg',
            boxShadow: 'xl',
          })}
        >
          <div className={css({ display: 'grid', gap: '0.5rem' })}>
            <Heading slot="title" className={css({ fontSize: 'lg', fontWeight: 'bold' })}>
              発注履歴に記録しますか？
            </Heading>
            <p className={css({ color: 'stone.600' })}>
              FAX の内容を確認して問題なければ、今回の発注を履歴として登録します。
            </p>
          </div>
          <div className={css({ display: 'flex', justifyContent: 'end', gap: '0.75rem' })}>
            <Button
              isDisabled={isRegistering}
              onPress={() => onOpenChange(false)}
              className={css({
                px: '1rem',
                py: '0.625rem',
                color: 'stone.700',
                bg: { base: 'stone.100', _hover: 'stone.200', _active: 'stone.300' },
                borderRadius: 'md',
                fontWeight: 'bold',
                cursor: 'pointer',
              })}
            >
              今回は記録しない
            </Button>
            <Button
              isDisabled={isRegistering}
              onPress={onConfirm}
              className={css({
                px: '1rem',
                py: '0.625rem',
                color: 'white',
                bg: { base: 'orange.500', _hover: 'orange.600', _active: 'orange.700' },
                borderRadius: 'md',
                fontWeight: 'bold',
                cursor: 'pointer',
              })}
            >
              {isRegistering ? '登録中…' : '履歴に記録する'}
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
